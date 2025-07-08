import axiosInstance from "@/lib/axios"

type optimizationGoalsResponse = {
  optimization_goals: string[];
}

const getOptimizationGoals = async ({objective}: {objective: string}): Promise<optimizationGoalsResponse> => {
  try {
    const res = await axiosInstance.get<optimizationGoalsResponse>(`/optimization-goal/list?objective=${objective}`);
    return res.data
  } catch (error) {
    console.error('failed to fetch optimization goals: ', error);
  }
}

export default getOptimizationGoals