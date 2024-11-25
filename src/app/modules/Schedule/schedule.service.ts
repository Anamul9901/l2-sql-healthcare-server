import {addHours, format} from 'date-fns'

const inserIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const currentDate = new Date(startDate); //convert regulart to ISO dateTime
  const lastDate = new Date(endDate)
  
  while(currentDate <= lastDate){
    const startDateTime = new Date(
        addHours(
            `${format(currentDate, 'yyyy-MM-dd')}`,
            Number(startTime.split(':')[0])
        )
    )

    const endDateTime = new Date(
        addHours(
            `${format(lastDate, 'yyyy-MM-dd')}`,
            Number(endTime.split(':')[0])
        )
    )
    console.log(endDateTime)
    
  }
};

export const ScheduleService = {
  inserIntoDB,
};
