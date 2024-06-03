import { AWARDS, AwardKey, AwardKeys, CHOICES, CondensedAwardVotingData, ProcessedAwardVote, ProcessedAwardsVotingData } from "./AwardsTypes";

export const generateAwardKeys = (): AwardKeys => {
    const awardKeys: AwardKeys = {};
    for (const award of Object.values(AWARDS)) {
        const awardKey: AwardKey = {};
        for (const choice of Object.values(CHOICES)) {
            if (award === AWARDS.PEOPLES_CHOICE) {
                awardKey[choice] = 'People\'s Choice';
                continue;
            }
            awardKey[choice] = `Best ${award} ${choice}`;
        }
        awardKeys[award] = awardKey;
    }

    return awardKeys;
}

export const extractAwardCategory = (
    votingData: ProcessedAwardsVotingData,
    award: AWARDS
): CondensedAwardVotingData => {
    const condensedData: CondensedAwardVotingData = {};

    if (!votingData) {
        return condensedData;
    }

    Object.keys(votingData).forEach((timestamp: string) => {
        condensedData[timestamp] = votingData[timestamp][award];
    });
    return condensedData;
}

export const transformCSVFile = (file: File) => {
    const processedData = {} as ProcessedAwardsVotingData;

    if (!file) {
        return processedData;
    }

    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
            fileReader.abort();
            reject(new DOMException('Problem parsing input file.'));
        }
        fileReader.onload = () => {
            const fileContent = fileReader.result as string;
            const rows: string[] = fileContent.split('\r\n');
            const headers: string[] = rows[0].split(',');
            const awardKeys: AwardKeys = generateAwardKeys();
    
            for (let i = 1; i < rows.length; i++) {
                const rowData: string[] = rows[i].split(',');
                const mapping = {} as ProcessedAwardVote;
    
                Object.values(AWARDS).forEach((award) => {
                    mapping[award] = [
                        rowData[headers.indexOf(awardKeys[award][CHOICES.FIRST])],
                        rowData[headers.indexOf(awardKeys[award][CHOICES.SECOND])],
                        rowData[headers.indexOf(awardKeys[award][CHOICES.THIRD])],
                    ];
                });
    
                processedData[rowData[0]] = mapping;
            }
            resolve(processedData);
        }
        fileReader.readAsText(file);
    });
}

export const countVote = (categoryData: CondensedAwardVotingData) => {
    const nominees: {
        [nominee: string]: number;
    } = {};

    Object.values(categoryData).forEach((nomineeRankings) => {
        nomineeRankings.forEach((nominee, index) => {
            if (nominee in nominees) {
                switch (index) {
                    case 0:
                        nominees[nominee] += 4;
                    case 1:
                        nominees[nominee] += 2;
                    case 2:
                        nominees[nominee] += 1;
                }
            } else {
                nominees[nominee] = 1;
            }
        });
    });

    return nominees;
}