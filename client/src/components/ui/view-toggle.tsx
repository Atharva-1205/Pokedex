import React from 'react';
import { Switch } from '@/components/ui/switch';

interface ViewToggleProps {
  isChecked: boolean;
  onToggle: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ isChecked, onToggle }) => {
  return (
    <div className="relative">
      <Switch
        checked={isChecked}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-accent"
      />
    </div>
  );
};

export default ViewToggle;
