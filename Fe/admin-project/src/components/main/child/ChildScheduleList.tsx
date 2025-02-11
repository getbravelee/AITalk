import './ChildScheduleList.css';
import { Treatment } from '../../../utils/treatmentDummyData';

interface ChildScheduleListProps {
  treatments: Treatment[];
}

export default function ChildScheduleList({ treatments }: ChildScheduleListProps) {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>회차</th>
          <th>단어 치료</th>
          <th>대화 치료</th>
          <th>일자</th>
        </tr>
      </thead>
      <tbody>
        {treatments
          .slice()
          .sort((a, b) => new Date(b.treatmentDate).getTime() - new Date(a.treatmentDate).getTime()) // ✅ 최신 치료가 위로
          .map((treatment, index, arr) => (
            <tr key={treatment.treatmentId}>
              <td>{arr.length - index}</td> 
              <td>{treatment.words}</td>
              <td>{treatment.sentence}</td>
              <td>{`${treatment.treatmentDate} ${treatment.startTime}`}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
