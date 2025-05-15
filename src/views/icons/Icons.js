import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
  IconBuilding,
  IconCalendar,
  IconMessage,
  IconLayoutDashboard
} from '@tabler/icons-react';

const Icons = () => {
  return (
    <PageContainer title="Icons" description="this is Icons">

      <DashboardCard title="Icons">
    <div style={{ display: 'flex', gap: '20px' }}>
      <div><IconBuilding size={32} /> <p>회의실 목록</p></div>
      <div><IconCalendar size={32} /> <p>예약 현황</p></div>
      <div><IconMessage size={32} /> <p>문의</p></div>
      <div><IconLayoutDashboard size={32} /> <p>대시보드</p></div>
    </div>
      </DashboardCard>
    </PageContainer>
  );
};

export default Icons;
