import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/Card";

interface KpData {
    time: number;
    kp: number;
}

export const KpGraph = ({ data }: { data: KpData[] }) => {
    return (
        <Card glow className="p-4 h-[300px] flex flex-col bg-black/40 border-cyan-500/30">
            <h3 className="text-lg font-orbitron text-blue-300 mb-4">GEOMAGNETIC ACTIVITY (Kp)</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                        <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 9]} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#60a5fa' }}
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                        />
                        <Line type="monotone" dataKey="kp" stroke="#60a5fa" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#fff' }} animationDuration={500} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
