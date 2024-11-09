import { NewOver, NewTeam, OverData, TeamData } from '../@core/interfaces/Interface';
import { axiosIntance } from '../@core/utils/axiosInstance';

export const getAllTeamData = async () => {
    const response = await axiosIntance?.get(`/teamData`);
    return response?.data as TeamData[];
};

export const sendTeamData = async (data: NewTeam): Promise<void> => {
    const response = await axiosIntance?.post(`/teamData`, data);
    return response?.data;
};

export const updateTeamData = async (data: TeamData) => {
    await axiosIntance.put(`/teamData/${data?.id}`, data);
};

export const deleteTeamData = async (id: string): Promise<void> => {
    const response = await axiosIntance?.delete(`/teamData/${id}`);
    return response?.data;
};

// Overs Data API
export const getAllOverData = async () => {
    const response = await axiosIntance?.get(`/overs`);
    return response?.data as OverData[];
};

export const sendOverData = async (data: NewOver): Promise<void> => {
    const response = await axiosIntance?.post(`/overs`, data);
    return response?.data;
};

export const updateOverData = async (data: OverData) => {
    await axiosIntance?.put(`/overs/${data?.id}`, data);
};

export const deleteOverData = async (id: string): Promise<void> => {
    const response = await axiosIntance?.delete(`/overs/${id}`);
    return response?.data;

};










// import axios from 'axios';
// import { NewOver, NewTeam, OverData, TeamData } from '../@core/interfaces/Interface';

// export const getAllTeamData = async () => {
//     const response = await axios.get(`http://localhost:3000/teamData`);
//     return response?.data;
// };

// export const sendTeamData = async (data: NewTeam) => {
//     const response = await axios.post(`http://localhost:3000/teamData`, data);
//     return response?.data;
// };

// export const updateTeamData = async (data: TeamData) => {
//     await axios.put(`http://localhost:3000/teamData/${data?.id}`, data);
// };

// export const deleteTeamData = async (id: string) => {
//     const response = await axios.delete(`http://localhost:3000/teamData/${id}`);
//     return response?.data;
// };

// // Over Data API
// export const getAllOverData = async () => {
//     const response = await axios.get(`http://localhost:3000/overs`);
//     return response?.data;
// };

// export const sendOverData = async (data: NewOver) => {
//     console.log('data', data);
//     const response = await axios.post(`http://localhost:3000/overs`, data);
//     return response?.data;
// };

// export const updateOverData = async (data: OverData) => {
//     await axios.put(`http://localhost:3000/overs/${data?.id}`, data);
// };

// export const deleteOverData = async (id: string) => {
//     const response = await axios?.delete(`http://localhost:3000/overs/${id}`);
//     return response?.data;
// };























