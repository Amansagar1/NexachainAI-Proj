import {
  LayoutDashboard,
  Coins,
  TrendingUp,
  Users,
  Network,
  Wallet,
  User,
  Settings,
} from 'lucide-react';
import { ROUTES } from './routes';

export const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: 'Investments',
    path: ROUTES.INVESTMENTS,
    icon: Coins,
  },
  {
    name: 'ROI History',
    path: ROUTES.ROI_HISTORY,
    icon: TrendingUp,
  },
  {
    name: 'Referral Income',
    path: ROUTES.REFERRAL_INCOME,
    icon: Users,
  },
  {
    name: 'Referral Tree',
    path: ROUTES.REFERRAL_TREE,
    icon: Network,
  },
  {
    name: 'Wallet',
    path: ROUTES.WALLET,
    icon: Wallet,
  },
  {
    name: 'Profile',
    path: ROUTES.PROFILE,
    icon: User,
  },
  {
    name: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];
