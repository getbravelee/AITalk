import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

interface ScheduleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: Date | null;
}

const ScheduleDialog = ({ open, setOpen, date }: ScheduleDialogProps) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>일정 추가/수정</DialogTitle>
      <DialogContent>
        <p>선택한 날짜: {date ? date.toLocaleDateString() : '없음'}</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(false)}
        >
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
