import React from 'react';
interface AnalyticsDashboardProps {
    className?: string;
    apiBasePath?: string;
    periods?: Array<{
        value: string;
        label: string;
    }>;
    defaultPeriod?: string;
}
export declare function AnalyticsDashboard({ className, apiBasePath, periods, defaultPeriod, }: AnalyticsDashboardProps): React.JSX.Element;
export {};
