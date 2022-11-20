export type SampleStateType = {
  count: number;
  control: {
    isLoading: boolean;
  };
};

export const sampleInitState: SampleStateType = {
  count: 0,
  control: {
    isLoading: false,
  },
};
