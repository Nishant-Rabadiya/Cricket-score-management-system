import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getAllOverData, getAllTeamData, updateOverData, updateTeamData } from '../api/api';
import { calculateTotalRuns, getTeamData, teamMutation } from './commonFunction';
import { Over, OverData, Player, TargetData, TeamData, TotalScore } from '../@core/interfaces/Interface';

const ScoreBoard: React.FC = () => {
    const getTeamsData = getTeamData('teamData', getAllTeamData);
    const mutation = teamMutation('teamData', updateTeamData);
    const getOverData = getTeamData('overs', getAllOverData);
    const overMutation = teamMutation('overs', updateOverData); 

    const [teamData, setTeamData] = useState<TeamData>();
    const [currentBattingTeam, setCurrentBattingTeam] = useState<Player[]>([]);
    const [currentBowlingTeam, setCurrentBowlingTeam] = useState<Player[]>([]);

    const [overData, setOverData] = useState<OverData>();
    const [currentOverNumber, setCurrentOverNumber] = useState<number>(1);
    const [currentOverBalls, setCurrentOverBalls] = useState<string[]>([]);  
    const [isInningComplete, setIsInningComplete] = useState<boolean>(false); 

    const currBatsmen: Player[] = currentBattingTeam?.filter((player: Player) => player?.isBatting).slice(0, 2);
    const currBowler: Player | undefined = currentBowlingTeam?.find((player: Player) => player?.isBowling);
    const getTargetScore: TargetData = JSON.parse(localStorage?.getItem('target') as string);  

    useEffect(() => {
        setTeamData(getTeamsData?.[0] as TeamData);
        const teamA = getTeamsData?.[0]?.teamA || [];
        const teamB = getTeamsData?.[0]?.teamB || [];
        setCurrentBattingTeam(isInningComplete ? teamB as Player[] : teamA as Player[]); 
        setCurrentBowlingTeam(isInningComplete ? teamA as Player[] : teamB as Player[]);
        setIsInningComplete(getTargetScore?.inning);

        if (getOverData?.length > 0) {
            setOverData(getOverData[0] as OverData);
            const teamAOverData: Over = isInningComplete ? getOverData[0]?.teamB as Over : getOverData[0]?.teamA as Over;

            const existingOvers: string[] = Object.keys(teamAOverData)
                .filter((key) => teamAOverData[key as keyof Over].length > 0)
                .sort((a, b) => parseInt(a.replace('over', '')) - parseInt(b.replace('over', '')));

            const lastOverKey: string | null = existingOvers.length > 0 ? existingOvers[existingOvers.length - 1] : null;
            const lastOverNumber: number = lastOverKey ? parseInt(lastOverKey.replace('over', '')) : 0;

            if (lastOverNumber === 0) {
                setCurrentOverNumber(1);
                setCurrentOverBalls([]);
            } else {
                const lastOverBalls: string[] = teamAOverData[`over${lastOverNumber}` as keyof Over] || [];
                const fairBall: number = lastOverBalls?.filter((ball : string) => ball !== 'WD' &&  ball !== 'NB').length;

                if (fairBall < 6) {
                    setCurrentOverNumber(lastOverNumber);
                    setCurrentOverBalls(lastOverBalls);
                } else if (lastOverNumber < 6) {
                    setCurrentOverNumber(lastOverNumber + 1);
                    setCurrentOverBalls([]);
                } else {
                    setCurrentOverNumber(lastOverNumber);
                    setCurrentOverBalls(lastOverBalls);
                }
            }
        }
    }, [getTeamsData, getOverData, isInningComplete]);

    const totalScore: TotalScore = calculateTotalRuns(isInningComplete ? overData?.teamB as Over : overData?.teamA as Over);
    const disableButtons: boolean = isInningComplete && totalScore?.totalRuns > parseInt(getTargetScore?.target);

    const rotateBowler = () => {
        if (currentBowlingTeam?.length === 0) return;
    
        const currentIndex: number = currentBowlingTeam?.findIndex((bowler: Player) => bowler?.isBowling);
        const nextIndex: number = (currentIndex - 1 + currentBowlingTeam?.length) % currentBowlingTeam?.length; 
    
        const updatedBowlingTeam: Player[] = currentBowlingTeam?.map((bowler: Player, index: number) => ({
            ...bowler,
            isBowling: index === nextIndex,
        }));
    
        setCurrentBowlingTeam(updatedBowlingTeam);
        setTeamData((prev: TeamData | undefined) => {
            if (!prev) return prev;
            return isInningComplete
                ? { ...prev, teamA: updatedBowlingTeam }
                : { ...prev, teamB: updatedBowlingTeam };
        });
    };
    
    const handleUpdateScoreButton = async (value: string) => {
        if (disableButtons) {
            return; 
        }

        if (isInningComplete) {
            if (totalScore?.totalRuns + (value === 'WD' || value === 'NB' || value === 'BYE' || value === 'LB'? 1 : parseInt(value)) > parseInt(getTargetScore?.target)) {
                alert('Australia won the match!');
            } else if (currentBattingTeam?.filter((player : Player) => !player?.isOut).length === 0 || (currentOverNumber === 6 && currentOverBalls?.filter(ball => ball !== 'WD' && ball !=='NB')?.length === 6)) {
                alert('India won the match!');
                return;
            }
        }
        
        if (currentOverNumber === 6 && currentOverBalls?.filter(ball => ball !== 'WD' && ball !=='NB')?.length === 6) {
            if (!isInningComplete) {
                const confirmationMessage = confirm('Should we start the next inning?');
                if (confirmationMessage) {
                    localStorage.setItem('target',JSON.stringify({target:totalScore?.totalRuns, inning: true }));
                    setIsInningComplete(true);
                }
                return;
            }
        }
    
        const updatedTeam: (Player | undefined)[] = currentBattingTeam?.map((player: Player) => {
            switch (value) {
                case '0':
                    if (player?.isOnStrike) {
                        return { ...player, ball: player?.ball + 1 };
                    }
                    return player;
                case '1':
                case '3':
                    if (player?.isOnStrike) {
                        return { ...player, ball: player?.ball + 1, run: player?.run + parseInt(value), isOnStrike: false };
                    }
                    if (player?.isBatting && !player?.isOnStrike) {
                        return { ...player, isOnStrike: true };
                    }
                    return player;
                case '2':
                case '4':
                case '6':
                    if (player?.isOnStrike) {
                        return { ...player, ball: player?.ball + 1, run: player?.run + parseInt(value) };
                    }
                    return player;
                case 'WD':
                    return player;
                case 'NB':
                case 'BYE':
                case 'LB':
                    if (player?.isOnStrike) {
                        return { ...player, ball: player?.ball + 1 };
                    }
                    return player;
                case 'OUT':
                    if (player?.isOnStrike) {
                        return { ...player, ball: player?.ball + 1, isOnStrike: false, isOut: true, isBatting: false };
                    }
                    if (player?.isBatting && !player?.isOnStrike) {
                        return { ...player, isOnStrike: false };
                    }
                    const nextBatsman = currentBattingTeam?.find(batsman => !batsman?.isOut && !batsman?.isBatting);
                    if (nextBatsman && nextBatsman === player) {
                        return {
                            ...player,
                            isOnStrike: true,
                            isBatting: true
                        };
                    }
                    return player;
                default:
                    break;
            }
        });
    
        if (currentBattingTeam?.find((batsman: Player) => !batsman?.isOut && !batsman?.isBatting) || currentOverNumber === 6) {
            setCurrentBattingTeam(updatedTeam as Player[]);
            setTeamData((prev: TeamData | undefined) => {
                if (!prev) return prev;

                return isInningComplete
                    ? { ...prev, teamB: updatedTeam as Player[] }
                    : { ...prev, teamA: updatedTeam as Player[]};
            });

            const updatedOverBalls: string[] = [...currentOverBalls, value];
            const fairBallCount: number = updatedOverBalls?.filter((ball: string) => ball !== 'WD' && ball !== 'NB')?.length;
    
            const updatedOverData = { ...overData };
            if (isInningComplete) {
                updatedOverData.teamB = { ...overData?.teamB as Over, [`over${currentOverNumber}`]: updatedOverBalls as string[] };
            } else {
                updatedOverData.teamA = { ...overData?.teamA as Over, [`over${currentOverNumber}`]: updatedOverBalls as string[] };
            }
            setOverData(updatedOverData as OverData);
            await overMutation.mutateAsync({ id: overData?.id, ...updatedOverData });
    
            if (value !== 'WD' && value !== 'NB') {
                if (fairBallCount === 6) {
                    setTimeout(() => {
                        setCurrentOverNumber((prev :number) => prev + 1);
                        setCurrentOverBalls([]);
                        rotateBowler();

                        const currentTeam: (Player | undefined)[] = updatedTeam?.map((player): Player => {
                            if (player?.isBatting) {
                                return { ...player, isOnStrike: !player?.isOnStrike };
                            }
                            return player as Player;
                        });
        
                        setCurrentBattingTeam(currentTeam as Player[]);
                        setTeamData((prev: TeamData | undefined) => {
                            if (!prev) return prev;
            
                            return isInningComplete
                                ? { ...prev, teamB: currentTeam as Player[] }
                                : { ...prev, teamA: currentTeam as Player[]};
                        });
                    }, 50);
                } else {
                    setCurrentOverBalls(updatedOverBalls);
                }
            } else {
                setCurrentOverBalls(updatedOverBalls);
            }
    
        } else {
            if (isInningComplete) {
                if(parseInt(getTargetScore?.target) === totalScore?.totalRuns){
                    alert('Match draw!');
                    return;
                } else if (parseInt(getTargetScore?.target) > totalScore?.totalRuns) {
                    alert('India won the match!');
                    return;
                } else {
                    alert('Australia won the match!');
                    return;
                }
            } else {
                const confirmationMessage: boolean = confirm(`All out! Let's start the next inning!`);
                if (confirmationMessage) {
                    localStorage.setItem('target',JSON.stringify({target:totalScore?.totalRuns, inning: true }));
                    setIsInningComplete(true);
                }
            }
            return;
        }
    };
    
    useEffect(() => {
        if(teamData as TeamData) {
            mutation.mutate({ id: teamData?.id, ...teamData });
        }
    }, [teamData]);

    return (
        <div className='d-flex score-board-section'>
            <div className='leftside-scoreboard border border-secondary w-50 d-flex flex-column gap-5'>
                <p className='fw-bold px-3 pt-4'>{currentBattingTeam[0]?.team || 'Team A'}</p>
                <div className='text-center'>
                    <h1>{totalScore?.totalRuns || '0'}/{currentBattingTeam?.filter((out: Player) => out?.isOut === true).length || '0'}</h1>
                    <p className='over-and-target m-0'>Over <span className='text-dark'>{Math.floor(totalScore?.totalOver / 6)+'.'+totalScore?.totalOver % 6  || '0.0'}</span></p>
                    {isInningComplete && <p className='over-and-target m-0'>Target <span className='text-dark'>{isInningComplete ? getTargetScore?.target : '0'}</span></p>} 
                </div>

                <div className='d-flex'>
                    {currBatsmen?.map((batsman : Player) => (
                        <div key={batsman?.id} className={`w-50 text-center m-2 rounded border ${batsman?.isOnStrike ? 'border-danger' : 'border-secondary'}`}>
                            <p className='batsman-name m-0'>{batsman?.name} <sup>{batsman?.isOnStrike ? <i className='fa-solid fa-star-of-life'></i> : ''}</sup></p>
                            <p className='batsman-score m-0 text-secondary'>
                                {batsman?.run}({batsman?.ball})
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='border border-secondary w-50'>
                <div className='current-over rounded m-2'>
                    <p className='m-3 fw-bold'><span><i className='fa-solid fa-baseball'></i></span> {currBowler?.name || 'Bowler'}</p>
                    <div className='d-flex'>
                        {currentOverBalls?.map((ball: string, index: number) => (
                            <p key={index} className='over-balls bg-light d-flex justify-content-center align-items-center border border-secondary rounded-circle m-0 mx-2'>
                                {ball}
                            </p>
                        ))}
                    </div>
                </div>

                <div className='my-5'>
                    <Table bordered>
                        <tbody>
                            <tr className='text-center'>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('0')}>0</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('1')}>1</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('2')}>2</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('3')}>3</button></td>
                            </tr>
                            <tr className='text-center'>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('4')}>4</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('6')}>6</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('WD')}>WD</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('NB')}>NB</button></td>
                            </tr>
                            <tr className='text-center'>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('BYE')}>BYE</button></td>
                                <td className='w-25'><button className='score-buttons fw-bold' disabled={disableButtons} onClick={() => handleUpdateScoreButton('LB')}>LB</button></td>
                                <td className='w-25' colSpan={2}><button className='score-buttons fw-bold text-danger' disabled={disableButtons} onClick={() => handleUpdateScoreButton('OUT')}>OUT</button></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ScoreBoard;




