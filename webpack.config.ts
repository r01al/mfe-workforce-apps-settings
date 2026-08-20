import { createRemoteConfig, type BuildArguments } from '@r01al/mfe-workforce-common-server/build';
const appDirectory = process.cwd();

export default (environment: Record<string, unknown>, argv: BuildArguments) => createRemoteConfig({
	name: 'settings',
	appDirectory,
	port: 3006,
	exposes: { './Settings': './src/Settings' },
}, environment, argv);
