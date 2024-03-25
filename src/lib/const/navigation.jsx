import {
	HiOutlineViewGrid,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineDocumentAdd
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'overview',
		label: 'Overview',
		path: '/dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'election',
		label: 'Election',
		path: '/dashboard/election',
		icon: <HiOutlineCalendar />
	},
	{
		key: 'voters',
		label: 'Voters',
		path: '/dashboard/voters',
		icon: <HiOutlineCalendar />
	},
	{
		key: 'candidate',
		label: 'Candidate',
		path: '/dashboard/candidate',
		icon: <HiOutlineUser />
	},
	{
		key: 'create',
		label: 'Create',
		path: '/dashboard/create',
		icon: <HiOutlineDocumentAdd />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]