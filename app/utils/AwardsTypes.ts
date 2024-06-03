export enum AWARDS {
    SCREENPLAY = 'Screenplay',
    COSTUME_AND_MAKEUP = 'Costume and Makeup',
    PRODUCTION_DESIGN = 'Production Design',
    GAFFING = 'Gaffing',
    SOUND = 'Sound',
    SCORE = 'Score',
    EDITING = 'Editing',
    SUPPORTING_ACTOR = 'Supporting Actor',
    LEAD_ACTOR = 'Lead Actor',
    CINEMATOGRAPHY = 'Cinematography',
    DIRECTOR = 'Director',
    INDEPENDENT_FILM = 'Independent Film',
    PICTURE = 'Picture',
    PEOPLES_CHOICE = 'People\'s Choice',
}

export enum CHOICES {
    FIRST = '[First Choice]',
    SECOND = '[Second Choice]',
    THIRD = '[Third Choice]',
}

export interface AwardKey {
    [choice: string]: string;
}

export interface AwardKeys {
    [award: string]: AwardKey;
}

/**
 * This object will contain a key set of all the awards.
 * Values will be a string array representing the rankings of each nomination for that award.
 */
export interface ProcessedAwardVote {
    [award: string]: string[];
}

/**
 * Timestamp acts as the unique voter identifier.
 * Each entry will contain the timestamp mapped to the voting results for that voter.
 */
export interface ProcessedAwardsVotingData {
    [timestamp: string]: ProcessedAwardVote;
}

/**
 * Contains the voting data for a single award.
 */
export interface CondensedAwardVotingData {
    [timestamp: string]: string[];
}

export interface VotingResults {
    [award: string]: string;
}