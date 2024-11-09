import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { UserContext } from '../../App';
import { deleteOverData, deleteTeamData, getAllOverData, getAllTeamData, sendOverData, sendTeamData } from '../../api/api';
import { overTeamA, overTeamB, teamA, teamB } from '../../@core/constants';
import { getTeamData, teamMutation } from '../commonFunction';
import { NewTeam, Over, Player, UserContextType } from '../../@core/interfaces/Interface';

const NewMatchModal: React.FC = () => {
  const { showModal, setShowModal } = useContext(UserContext) as UserContextType;

  const teamData = getTeamData('teamData', getAllTeamData);
  const mutation = teamMutation('teamData', sendTeamData);
  const mutationDetele = teamMutation('teamData', deleteTeamData);
  
  const overData = getTeamData('overs', getAllOverData);
  const overMutation = teamMutation('overs', sendOverData);
  const overMutationDetele = teamMutation('overs', deleteOverData);
  
  const handleYesButton = async () => {
    if(teamData && overData) {
      mutationDetele?.mutate(teamData[0]?.id);
      overMutationDetele?.mutate(overData[0]?.id);
    }
    const newTeam : NewTeam = {
      teamA : teamA as Player[],
      teamB : teamB as Player[]
    }
    await mutation.mutateAsync(newTeam as NewTeam);

    const newOver = {
      teamA : overTeamA as Over,
      teamB : overTeamB as Over
    }
    await overMutation.mutateAsync(newOver);
    localStorage.setItem('target',JSON.stringify({target:0, inning: false }) );
    setShowModal(false);
  };

  return (
    <Modal
      show={showModal}
      onHide={handleYesButton}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header className='d-flex justify-content-between ailgn-items-center'>
        <Modal.Title>New match</Modal.Title>
        <button type='button' className='btn btn-outline-secondary' onClick={() => setShowModal(false)}>X</button>
      </Modal.Header>
      <Modal.Body className='fs-5'>
        Are you sure you want to start new match?
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleYesButton}>
          Yes
        </Button>
        <Button variant='primary' onClick={() => setShowModal(false)}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewMatchModal;









// import React, { useContext } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import { UserContext, UserContextType } from '../../App';
// import { deleteOverData, deleteTeamData, getAllOverData, getAllTeamData, sendOverData, sendTeamData } from '../../api/api';
// import { overTeamA, overTeamB, teamA, teamB } from '../../@core/constants';
// import { getTeamData, teamMutation } from '../commonFunction';

// const NewMatchModal = () => {
//   const { showModal, setShowModal } = useContext(UserContext) as UserContextType;

//   const teamData = getTeamData('teamData', getAllTeamData);
//   const mutation = teamMutation('teamData', sendTeamData);
//   const mutationDetele = teamMutation('teamData', deleteTeamData);
  
//   const overData = getTeamData('overs', getAllOverData);
//   const overMutation = teamMutation('overs', sendOverData);
//   const overMutationDetele = teamMutation('overs', deleteOverData);
  

//   const handleYesButton = async () => {
//     if(teamData?.length && overData?.length) {
//       mutationDetele?.mutate(teamData[0]?.id);
//       overMutationDetele?.mutate(overData[0]?.id);
//     }
//     const newTeam = {
//       teamA : teamA,
//       teamB : teamB
//     }
//     await mutation.mutateAsync(newTeam);

//     const newOver = {
//       teamA : overTeamA,
//       teamB : overTeamB
//     }
//     await overMutation.mutateAsync(newOver);
//     localStorage.setItem('target',JSON.stringify({target:0, inning: false }) );
//     setShowModal(false);
//   };

//   return (
//     <Modal
//       show={showModal}
//       onHide={handleYesButton}
//       backdrop='static'
//       keyboard={false}
//     >
//       <Modal.Header className='d-flex justify-content-between ailgn-items-center'>
//         <Modal.Title>New match</Modal.Title>
//         <button type='button' className='btn btn-outline-secondary' onClick={() => setShowModal(false)}>X</button>
//       </Modal.Header>
//       <Modal.Body className='fs-5'>
//         Are you sure you want to start new match?
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant='secondary' onClick={handleYesButton}>
//           Yes
//         </Button>
//         <Button variant='primary' onClick={() => setShowModal(false)}>
//           No
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   )
// }

// export default NewMatchModal;
