import { mountStandalone } from '@r01al/mfe-workforce-common-client/standalone';
import '@r01al/mfe-workforce-common-client/standalone.css';
import Settings from './Settings';

mountStandalone({
	component: Settings,
	route: '/settings',
});
