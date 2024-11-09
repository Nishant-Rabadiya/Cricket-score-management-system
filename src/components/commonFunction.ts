import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Over, OverData, TeamData, TotalScore } from '../@core/interfaces/Interface';

type QueryFn<T> = () => Promise<T>;

export const getTeamData = (queryKey: string, queryFn: QueryFn<TeamData[] | OverData[]>) => {
    const { data } = useQuery({
        queryKey: [queryKey],
        queryFn: queryFn,
        staleTime: Infinity,
    });

    return (queryKey === 'teamData') ? data as TeamData[] :  data as OverData[];
};

export const teamMutation = (queryKey: string, queryFn: (data: any) => Promise<void>) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: queryFn,
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey as any);
        },
    });

    return mutation;
};

export const calculateTotalRuns = (teamData: Over) => {
    const totalScore: TotalScore = {
        totalRuns : 0,
        totalOver : 0
    }
    for (const over in teamData) {
      const deliveries = teamData[over as keyof Over];
      deliveries?.map((ball: string) => {
        if (ball !== 'WD' && ball !== 'NB') {
            totalScore.totalOver += 1;
        }
        switch (ball) {
            case 'WD':
            case 'NB':
            case 'LB':
            case 'BYE':
            totalScore.totalRuns += 1;
            break;      
          default:
            totalScore.totalRuns += parseInt(ball) || 0;
            break;
        }
      });
    }
    return totalScore;
};

































// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// export const getTeamData = (queryKey, queryFn) => {
//     const { data } = useQuery({
//         queryKey: [queryKey],
//         queryFn: queryFn,
//         staleTime: Infinity,
//     });

//     return data;
// };

// export const teamMutation = (queryKey, queryFn) => {
//     const queryClient = useQueryClient();
//     const mutation = useMutation({
//         mutationFn: queryFn,
//         onSuccess: () => {
//             queryClient.invalidateQueries([queryKey]); 
//         }
//     });

//     return mutation;
// };


// export const calculateTotalRuns = (teamData) => {
//     const totalScore = {
//         totalRuns : 0,
//         totalOver : 0
//     }
//     for (const over in teamData) {
//       const deliveries = teamData[over];
//       deliveries?.map(ball => {
//         if (ball !== 'WD' && ball !== 'NB') {
//             totalScore.totalOver += 1;
//         }
//         switch (ball) {
//             case 'WD':
//             case 'NB':
//             case 'LB':
//             case 'BYE':
//             totalScore.totalRuns += 1;
//             break;      
//           default:
//             totalScore.totalRuns += parseInt(ball) || 0;
//             break;
//         }
//       });
//     }
//     return totalScore;
// };









