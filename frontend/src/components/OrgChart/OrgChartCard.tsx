import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface OrgChartCardProps {
  name: string;
  department: string;
  position: string;
  imageUrl?: string;
  customCssClassnames?: string;
  style?: React.CSSProperties;
  selected?: boolean;
}

const OrgChartCard: React.FC<OrgChartCardProps> = ({
  name,
  department,
  position,
  imageUrl,
  selected,
  style,
  customCssClassnames,
}) => {
  return (
    <Card
      className={`
      ${customCssClassnames ?? ''}
      ${selected ? 'ring-2 ring-primary' : ''}
    `}
      style={style}
    >
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-20 h-20">
          <img
            src={imageUrl ?? 'https://placehold.co/100'}
            alt={name}
            className="rounded-full object-cover"
          />
        </Avatar>
      </CardHeader>
      <CardContent className="text-center">
        <div className="font-bold text-lg">{name}</div>
        <div className="text-muted-foreground">{department}</div>
        <div className="text-sm">{position}</div>
      </CardContent>
    </Card>
  );
};

export default OrgChartCard;
