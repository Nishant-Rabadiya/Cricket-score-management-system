import React from 'react';
import { getAllOverData } from '../api/api';
import { getTeamData } from './commonFunction';
import { Over } from '../@core/interfaces/Interface';

const OverTimeline: React.FC = () => {

  const getOverData = getTeamData('overs', getAllOverData);

  if (!getOverData || getOverData.length === 0) {
    return <p>No over data available</p>;
  }

  const teamA = getOverData[0]?.teamA as Over;
  const teamB = getOverData[0]?.teamB as Over;

  const renderOvers = (team: Over, teamName: string) => {
    return (
      <div className='team-overs'>
        <h2 className='text-center'>{teamName}</h2>
        {Object.keys(team).map((overKey) => {
          const key = overKey as keyof Over; 
          return (
            <div key={key} className='over border border-1 rounded'>
              <h3>{`Over ${parseInt(key.replace('over', ''))}`}</h3>
              {team[key].length > 0 ? (
                <p className='m-0 font-monospace'>{`Balls: ${team[key].join(', ')}`}</p>
              ) : (
                <p className='m-0 font-monospace'>Current Over: No balls yet</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className='over-timeline'>
      {renderOvers(teamA as Over, 'India')}
      {renderOvers(teamB as Over, 'Australia')}
    </div>
  );
};

export default OverTimeline;


















  // const renderOvers = (team: Over, teamName: string) => {
  //   return (
  //     <div className='team-overs'>
  //       <h2 className='text-center'>{teamName}</h2>
  //       {Object.keys(team)?.map((overKey, index) => (
  //         <div key={index} className='over border border-1 rounded'>
  //           <h3>{`Over ${index + 1}`}</h3>
  //           {team[overKey].length > 0 ? (
  //             <p className='m-0 font-monospace'>{`Balls: ${team[overKey].join(', ')}`}</p>
  //           ) : (
  //             <p className='m-0 font-monospace'>Current Over: No balls yet</p>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };












































// import React from 'react';
// import { getAllOverData } from '../api/api';
// import { getTeamData } from './commonFunction';

// const OverTimeline = () => {
//   const getOverData = getTeamData('overs', getAllOverData);
//   // console.log('getOverData', getOverData);
//   return (
//     <div className='over-timeline'>
        
//     </div>
//   )
// }

// export default OverTimeline;
