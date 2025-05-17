import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const WorkerCard = ({ worker }) => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <img
        src={worker.photo || "/default-avatar.png"}
        alt={worker.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <CardContent className="p-0">
        <h4 className="font-semibold text-lg">{worker.name}</h4>
        <p className="text-sm text-gray-500">{worker.position}</p>
        {worker.email && (
          <p className="text-sm text-gray-400">{worker.email}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkerCard;
