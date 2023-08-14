import './index.scss';
import { Settings } from './types';

function SettingsCheckbox(props: {
  checked?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="SettingsPage-setting SettingsPage-setting--checkbox">
      <input
        checked={!!props.checked}
        className="SettingsPage-checkbox"
        onChange={event => props.onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="SettingsPage-label">
        {props.label}
      </span>
    </label>
  );
}

export default function SettingsPage(props: {
  onChange: (changedSettings: Settings) => void;
  settings: Settings;
}) {
  return (
    <div className="SettingsPage">
      <form className="SettingsPage-form">
        <SettingsCheckbox
          checked={!props.settings.disableHelpText}
          label="Show Hints"
          onChange={checked => props.onChange({ disableHelpText: !checked })}
        />
        <SettingsCheckbox
          checked={props.settings.hideCompletedLevels}
          label="Hide Completed Levels"
          onChange={checked => props.onChange({ hideCompletedLevels: checked })}
        />
      </form>
    </div>
  );
}
