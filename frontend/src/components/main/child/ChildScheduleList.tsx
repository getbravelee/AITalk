import "./ChildScheduleList.css";

interface Treatment {
  treatmentId: string;
  treatmentDate: string;
  startTime: string;
  endTime: string;
  words: string[];
  sentence: string[];
  conversation: string;
}

interface ChildScheduleListProps {
  treatments: Treatment[];
  onScheduleSelect: (scheduleId: string) => void; // ✅ 클릭 시 실행할 함수 추가
}

export default function ChildScheduleList({ treatments, onScheduleSelect }: ChildScheduleListProps) {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>회차</th>
          <th>치료 내용</th>
          <th>일자</th>
        </tr>
      </thead>
      <tbody>
        {treatments
          .slice()
          .sort((a, b) => new Date(b.treatmentDate).getTime() - new Date(a.treatmentDate).getTime()) // ✅ 최신 치료가 위로
          .map((treatment, index, arr) => {
            console.log("✅ 치료 데이터 확인:", treatment); // ✅ 데이터 디버깅
            return (
              <tr
                key={treatment.treatmentId}
                onClick={() => {
                  console.log("📌 클릭된 일정 ID:", treatment.treatmentId); // ✅ ID 확인 로그
                  if (treatment.treatmentId) {
                    onScheduleSelect(treatment.treatmentId); // ✅ 올바른 ID 전달
                  } else {
                    console.error("❌ treatmentId가 존재하지 않음:", treatment);
                  }
                }}
                className="clickable-row"
              >
                <td>{arr.length - index}회차</td>
                <td>{treatment.words.join(", ")}</td>
                <td>{`${treatment.treatmentDate} ${treatment.startTime}`}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
