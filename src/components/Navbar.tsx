import React, { useContext } from 'react';
import { UserContext } from '../App';
import { UserContextType } from '../@core/interfaces/Interface';

const Navbar: React.FC = () => {
    const { setShowModal } = useContext(UserContext) as UserContextType;

    return (
        <div className='d-flex justify-content-between align-items-center p-2 navbar'>
            <h3 className='m-0'>India vs Australia</h3>

            <button className='btn btn-success' type='button' onClick={() => setShowModal(true)}>New Match</button>
        </div>
    )
}

export default Navbar;
