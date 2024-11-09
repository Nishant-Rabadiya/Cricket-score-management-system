export interface UserContextType {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Player {
    id: number;
    name: string;
    role: string;
    isOnStrike: boolean;
    isOut: boolean;
    run: number;
    team: string;
    isCaptain: boolean;
    wicket: number;
    ball: number;
    isBatting: boolean;
    isBowling: boolean;
    over: number;
}
  
export interface TeamData {
  id: string,
  teamA: Player[];
  teamB: Player[];
}

export interface Over {
  over1: string[];
  over2: string[];
  over3: string[];
  over4: string[];
  over5: string[];
  over6: string[];
}

export interface OverData {
  id: string,
  teamA: Over;
  teamB: Over;
}

export interface NewTeam {
    teamA: Player[];
    teamB: Player[];
}

export interface NewOver {
    teamA: Over[];
    teamB: Over[];
}

export interface TargetData {
  inning: boolean;
  target: string;
}

export interface TotalScore {
  totalRuns: number;
  totalOver: number;
}