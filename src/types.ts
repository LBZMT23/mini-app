export interface Member {
  id: number;
  name: string;
  phone: string;
}

export interface Registration {
  auditStatus: 'pending' | 'approved' | 'rejected';
  popStatus: 'none' | 'pending' | 'approved' | 'rejected';
  popImages: string[];
  teamName: string;
  slogan: string;
  teamImg: string;
  capName: string;
  capPhone: string;
  city: string;
  members: Member[];
}

export interface Activity {
  id: number;
  title: string;
  city: string;
  loc: string;
  cur: number;
  max: number;
  img: string;
  enrollStart: number;
  enrollEnd: number;
  voteStart: number;
  voteEnd: number;
  activityEnd: number;
  voteTeamCount: number;
  totalVotes: number;
  status: string;
  statusText: string;
  time: string;
  voteTimeStr: string;
}
