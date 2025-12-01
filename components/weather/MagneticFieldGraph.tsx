import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "@/components/ui/Card";

interface MagData {
    time: number;
    bt: number;
    bz: number;
}

export const MagneticFieldGraph = ({ data }: { data: MagData[] }) => {
    return (
        <Card glow className="p-4 h-[300px] flex flex-col bg-black/40 border-cyan-500/30">
            <h3 className="text-lg font-orbitron text-green-300 mb-4">SOLAR WIND MAGNETIC FIELD</h3>
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
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', color: '#fff' }}
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="bt" name="Total (Bt)" stroke="#4ade80" strokeWidth={2} dot={false} animationDuration={500} />
                        <Line type="monotone" dataKey="bz" name="Vertical (Bz)" stroke="#f87171" strokeWidth={2} dot={false} animationDuration={500} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
