import React from 'react';
import Navbar from '../../components/Navbar';
import ScoreBoard from '../../components/ScoreBoard';
import OverTimeline from '../../components/OverTimeline';
import NewMatchModal from '../../components/modal/NewMatchModal';

const Dashboard: React.FC = () => {
  return (
    <>
      <div className='main-section'>
        <Navbar />

        <ScoreBoard />

        <OverTimeline />
      </div>

      <NewMatchModal />
    </>
  )
}

export default Dashboard;
