import React from 'react';
import { supabase } from '../lib/supabaseClient';

const DailyTaskCard = () => {
  const handleComplete = async () => {
    const { data, error } = await supabase.from('activities').insert({
      student_id: 'uuid-des-schülers',
      activity_type: 'task',
      points: 30,
      name: 'Hausaufgabe Mathe erledigt',
    });

    if (error) console.error(error);
    else console.log('Aktivität gespeichert:', data);
  };

  return (
    <div>
      {/* ...existing code... */}
      <button onClick={handleComplete}>✅ Abschließen</button>
      {/* ...existing code... */}
    </div>
  );
};

export default DailyTaskCard;