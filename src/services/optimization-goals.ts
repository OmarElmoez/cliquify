import axiosInstance from "@/lib/axios"

type optimizationGoalsResponse = {
  "optimization goals": string[];
}

const getOptimizationGoals = async ({objective}: {objective: string}): Promise<optimizationGoalsResponse> => {
  try {
    const res = await axiosInstance.get<optimizationGoalsResponse>(`/optimization-goal/list?objective=${objective}`);
    return res.data
  } catch (error) {
    
  }
}

export default getOptimizationGoals