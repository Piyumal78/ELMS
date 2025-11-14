import * as React from 'react';

function createIcon(label) {
  return function Icon(props) {
    const { className = '', ...rest } = props;
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
        {...rest}
      >
        <title>{label}</title>
        <circle cx="12" cy="12" r="8" stroke="currentColor" />
      </svg>
    );
  };
}

export const Microscope = createIcon('Microscope');
export const Beaker = createIcon('Beaker');
export const Lock = createIcon('Lock');
export const Mail = createIcon('Mail');
export const Wrench = createIcon('Wrench');
export const Clock = createIcon('Clock');
export const CheckCircle = createIcon('CheckCircle');
export const AlertTriangle = createIcon('AlertTriangle');
export const Package = createIcon('Package');
export const Search = createIcon('Search');
export const XCircle = createIcon('XCircle');
export const Calendar = createIcon('Calendar');
export const Users = createIcon('Users');
export const TrendingUp = createIcon('TrendingUp');
export const Bell = createIcon('Bell');
export const LogOut = createIcon('LogOut');
export const ChevronDown = createIcon('ChevronDown');
export const ClipboardList = createIcon('ClipboardList');
export const Home = createIcon('Home');
export const Plus = createIcon('Plus');
export const Edit = createIcon('Edit');
export const Trash2 = createIcon('Trash2');
export const Tag = createIcon('Tag');
export const Layers = createIcon('Layers');
export const ShoppingCart = createIcon('ShoppingCart');
export const ArrowRightCircle = createIcon('ArrowRightCircle');
export const RotateCcw = createIcon('RotateCcw');
export const CalendarDays = createIcon('CalendarDays');
export const Settings = createIcon('Settings');
export const Boxes = createIcon('Boxes');
