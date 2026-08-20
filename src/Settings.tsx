import { useEffect, useState } from 'react';
import { Bell, Building2, CalendarClock, Check, Moon, Palette, Save, Sun } from 'lucide-react';
import {
	applyPreferences,
	getTheme,
	readPreferences,
	savePreferences,
	setTheme,
	type ThemeMode,
	type WorkforcePreferences,
} from '@r01al/mfe-workforce-common-client';
import './settings.css';

type Section = 'appearance' | 'scheduling' | 'notifications' | 'organization';

const menu = [
	{ id: 'appearance' as const, label: 'Appearance', icon: Palette },
	{ id: 'scheduling' as const, label: 'Scheduling', icon: CalendarClock },
	{ id: 'notifications' as const, label: 'Notifications', icon: Bell },
	{ id: 'organization' as const, label: 'Organization', icon: Building2 },
];

const accents = ['#6757d9', '#327f9b', '#2e8b68', '#c8664d', '#b34f79'];

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
	return (
		<label className="switch" aria-label={label}>
			<input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
			<span />
		</label>
	);
}

function SettingRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
	return <div className="setting-row"><div className="setting-copy"><strong>{title}</strong><span>{description}</span></div>{children}</div>;
}

export default function Settings() {
	const [section, setSection] = useState<Section>('appearance');
	const [theme, updateTheme] = useState<ThemeMode>(getTheme);
	const [preferences, setPreferences] = useState<WorkforcePreferences>(readPreferences);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		applyPreferences(preferences);
	}, [preferences.accent, preferences.compact]);

	const update = <K extends keyof WorkforcePreferences>(key: K, value: WorkforcePreferences[K]) => {
		setPreferences((current) => ({ ...current, [key]: value }));
	};

	const chooseTheme = (next: ThemeMode) => {
		updateTheme(next);
		setTheme(next);
	};

	const save = () => {
		savePreferences(preferences);
		setSaved(true);
		window.setTimeout(() => setSaved(false), 2200);
	};

	return (
		<section>
			<div className="page-heading">
				<div><h1>Settings</h1><p>Shape Workforce Hub around the way your team works.</p></div>
				<button className="button is-small is-brand" type="button" onClick={save}><Save size={13} /> Save changes</button>
			</div>

			<div className="settings-layout">
				<nav className="settings-menu" aria-label="Settings sections">
					{menu.map(({ id, label, icon: Icon }) => (
						<button key={id} className={section === id ? 'active' : ''} type="button" onClick={() => setSection(id)}><Icon size={13} /> {label}</button>
					))}
				</nav>

				<div className="settings-content">
					{section === 'appearance' && (
						<article className="setting-group">
							<h2>Appearance</h2><p>Choose a comfortable look for your workspace.</p>
							<SettingRow title="Color mode" description="Switch between light and dark surfaces.">
								<div className="theme-options">
									<button className={`theme-option${theme === 'light' ? ' active' : ''}`} type="button" onClick={() => chooseTheme('light')}><Sun size={12} /> Light</button>
									<button className={`theme-option${theme === 'dark' ? ' active' : ''}`} type="button" onClick={() => chooseTheme('dark')}><Moon size={12} /> Dark</button>
								</div>
							</SettingRow>
							<SettingRow title="Accent color" description="Used for active states, charts, and actions.">
								<div className="color-options">
									{accents.map((accent) => <button key={accent} className={`color-option${preferences.accent === accent ? ' active' : ''}`} type="button" aria-label={`Use ${accent} accent`} style={{ '--swatch': accent } as React.CSSProperties} onClick={() => update('accent', accent)} />)}
								</div>
							</SettingRow>
							<SettingRow title="Compact density" description="Reduce spacing in tables and calendars.">
								<Toggle checked={preferences.compact} label="Compact density" onChange={(value) => update('compact', value)} />
							</SettingRow>
						</article>
					)}

					{section === 'scheduling' && (
						<article className="setting-group">
							<h2>Scheduling</h2><p>Configure the defaults used by team calendars.</p>
							<SettingRow title="Start week on Monday" description="Use Monday as the first calendar column."><Toggle checked={preferences.weekStartsMonday} label="Start week on Monday" onChange={(value) => update('weekStartsMonday', value)} /></SettingRow>
							<SettingRow title="Show weekends" description="Keep Saturday and Sunday visible on the calendar."><Toggle checked={preferences.showWeekends} label="Show weekends" onChange={(value) => update('showWeekends', value)} /></SettingRow>
							<SettingRow title="Conflict warnings" description="Warn when a worker has overlapping shifts."><Toggle checked={preferences.conflictWarnings} label="Conflict warnings" onChange={(value) => update('conflictWarnings', value)} /></SettingRow>
							<SettingRow title="Default timezone" description="Times throughout the workspace use this zone.">
								<div className="select is-small"><select value={preferences.timezone} onChange={(event) => update('timezone', event.target.value)}><option>Asia/Jerusalem</option><option>Europe/London</option><option>America/New_York</option><option>America/Los_Angeles</option></select></div>
							</SettingRow>
						</article>
					)}

					{section === 'notifications' && (
						<article className="setting-group">
							<h2>Notifications</h2><p>Decide which team updates should reach you.</p>
							<SettingRow title="Weekly email digest" description="Receive a Monday summary of coverage and hours."><Toggle checked={preferences.emailDigest} label="Weekly email digest" onChange={(value) => update('emailDigest', value)} /></SettingRow>
							<SettingRow title="Shift change alerts" description="Notify you when a published shift changes."><Toggle checked={preferences.shiftChanges} label="Shift change alerts" onChange={(value) => update('shiftChanges', value)} /></SettingRow>
							<SettingRow title="Browser notifications" description="Show time-sensitive alerts on this device."><Toggle checked={preferences.browserAlerts} label="Browser notifications" onChange={(value) => update('browserAlerts', value)} /></SettingRow>
						</article>
					)}

					{section === 'organization' && (
						<article className="setting-group">
							<h2>Organization</h2><p>Basic workspace details used in reports and communication.</p>
							<SettingRow title="Workspace name" description="Shown in exported schedules and team messages."><input className="input setting-input" defaultValue="Workforce Hub" aria-label="Workspace name" /></SettingRow>
							<SettingRow title="Primary location" description="The default location for newly added workers."><div className="select is-small"><select defaultValue="Downtown"><option>Downtown</option><option>Riverside</option></select></div></SettingRow>
							<SettingRow title="Language" description="Controls labels and date formatting."><div className="select is-small"><select value={preferences.language} onChange={(event) => update('language', event.target.value)}><option>English</option><option>Hebrew</option><option>Spanish</option></select></div></SettingRow>
						</article>
					)}
				</div>
			</div>
			{saved && <div className="save-toast" role="status"><Check size={13} /> Settings saved locally</div>}
		</section>
	);
}
