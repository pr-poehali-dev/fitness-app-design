import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

type Exercise = {
  id: number;
  name: string;
  locked: boolean;
  oldResult: { weight: number; reps: number };
  newResult?: { weight: number; reps: number };
  emoji: string;
};

type Set = {
  id: number;
  completed: boolean;
  oldResult: { weight: number; reps: number };
  newResult?: { weight: number; reps: number };
};

type Screen = 'workouts' | 'exercise' | 'creator' | 'stats';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('workouts');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [currentSet, setCurrentSet] = useState(1);
  const [inputWeight, setInputWeight] = useState('');
  const [inputReps, setInputReps] = useState('');

  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: 'Жим штанги лежа', locked: false, oldResult: { weight: 80, reps: 10 }, newResult: { weight: 85, reps: 10 }, emoji: '💪' },
    { id: 2, name: 'Приседания', locked: true, oldResult: { weight: 100, reps: 8 }, emoji: '🦵' },
    { id: 3, name: 'Становая тяга', locked: true, oldResult: { weight: 120, reps: 6 }, emoji: '🏋️' },
    { id: 4, name: 'Подтягивания', locked: true, oldResult: { weight: 0, reps: 12 }, emoji: '🔝' },
    { id: 5, name: 'Жим гантелей', locked: true, oldResult: { weight: 30, reps: 12 }, emoji: '💥' },
  ]);

  const [sets, setSets] = useState<Set[]>([
    { id: 1, completed: false, oldResult: { weight: 80, reps: 10 } },
    { id: 2, completed: false, oldResult: { weight: 80, reps: 10 } },
    { id: 3, completed: false, oldResult: { weight: 80, reps: 8 } },
    { id: 4, completed: false, oldResult: { weight: 75, reps: 8 } },
  ]);

  const weightProgressData = [
    { date: '1', weight: 78 },
    { date: '5', weight: 79 },
    { date: '10', weight: 81 },
    { date: '15', weight: 80 },
    { date: '20', weight: 82 },
    { date: '25', weight: 83 },
    { date: '30', weight: 85 },
  ];

  const exerciseProgressData = [
    { name: 'Жим лежа', weight: 85 },
    { name: 'Присед', weight: 100 },
    { name: 'Тяга', weight: 120 },
    { name: 'Подтяг.', weight: 15 },
  ];

  const recordsData = [
    { exercise: 'Жим лежа', weight: 85, reps: 10, date: '20.10.25' },
    { exercise: 'Приседания', weight: 100, reps: 8, date: '18.10.25' },
    { exercise: 'Становая', weight: 120, reps: 6, date: '15.10.25' },
  ];

  const handleStartSet = () => {
    setTimerActive(true);
    let seconds = 180;
    const interval = setInterval(() => {
      seconds--;
      setTimerSeconds(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setTimerActive(false);
        setTimerSeconds(180);
      }
    }, 1000);
  };

  const handleCompleteSet = () => {
    if (inputWeight && inputReps) {
      const updatedSets = [...sets];
      updatedSets[currentSet - 1] = {
        ...updatedSets[currentSet - 1],
        completed: true,
        newResult: { weight: parseInt(inputWeight), reps: parseInt(inputReps) }
      };
      setSets(updatedSets);
      setInputWeight('');
      setInputReps('');
      if (currentSet < 4) {
        setCurrentSet(currentSet + 1);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {currentScreen === 'workouts' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Тренировки</h1>
              <p className="text-muted-foreground text-sm">Сила в постоянстве</p>
            </div>
            <div className="w-12 h-12 rounded-full gradient-energy flex items-center justify-center">
              <Icon name="Flame" size={24} className="text-white" />
            </div>
          </div>

          <div className="space-y-3">
            {exercises.map((exercise) => (
              <Card
                key={exercise.id}
                className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                  exercise.locked ? 'opacity-50' : ''
                }`}
                onClick={() => !exercise.locked && (setSelectedExercise(exercise), setCurrentScreen('exercise'))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-energy flex items-center justify-center text-2xl">
                      {exercise.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      <div className="flex gap-2 items-center text-sm">
                        {exercise.newResult ? (
                          <>
                            <span className="text-muted-foreground line-through">
                              {exercise.oldResult.weight}кг × {exercise.oldResult.reps}
                            </span>
                            <Icon name="ArrowRight" size={14} className="text-primary" />
                            <span className="text-primary font-semibold">
                              {exercise.newResult.weight}кг × {exercise.newResult.reps}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            {exercise.oldResult.weight}кг × {exercise.oldResult.reps}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {exercise.locked ? (
                    <Icon name="Lock" size={20} className="text-muted-foreground" />
                  ) : (
                    <Icon name="ChevronRight" size={20} className="text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentScreen === 'exercise' && selectedExercise && (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen('workouts')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{selectedExercise.name}</h1>
              <p className="text-sm text-muted-foreground">4 подхода</p>
            </div>
          </div>

          <div className="space-y-3">
            {sets.map((set, index) => (
              <Card
                key={set.id}
                className={`p-4 transition-all ${
                  currentSet === index + 1 ? 'ring-2 ring-primary' : ''
                } ${currentSet < index + 1 ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={set.completed ? 'default' : 'outline'} className="gradient-energy">
                      Подход {set.id}
                    </Badge>
                    {set.completed && (
                      <Icon name="CheckCircle2" size={20} className="text-primary" />
                    )}
                  </div>
                </div>

                <div className="flex gap-4 text-sm">
                  {set.newResult ? (
                    <>
                      <span className="text-muted-foreground line-through">
                        {set.oldResult.weight}кг × {set.oldResult.reps}
                      </span>
                      <Icon name="ArrowRight" size={16} className="text-primary" />
                      <span className="text-primary font-semibold">
                        {set.newResult.weight}кг × {set.newResult.reps}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Прошлый: {set.oldResult.weight}кг × {set.oldResult.reps}
                    </span>
                  )}
                </div>

                {currentSet === index + 1 && !set.completed && (
                  <div className="mt-4 space-y-3">
                    {!timerActive ? (
                      <Button
                        onClick={handleStartSet}
                        className="w-full gradient-energy"
                      >
                        <Icon name="Play" size={20} className="mr-2" />
                        Начать подход
                      </Button>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gradient mb-2">
                          {formatTime(timerSeconds)}
                        </div>
                        <Progress value={(180 - timerSeconds) / 180 * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">Отдых</p>
                      </div>
                    )}

                    {timerSeconds < 180 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Вес (кг)</Label>
                          <Input
                            type="number"
                            value={inputWeight}
                            onChange={(e) => setInputWeight(e.target.value)}
                            placeholder="80"
                          />
                        </div>
                        <div>
                          <Label>Повторы</Label>
                          <Input
                            type="number"
                            value={inputReps}
                            onChange={(e) => setInputReps(e.target.value)}
                            placeholder="10"
                          />
                        </div>
                      </div>
                    )}

                    {inputWeight && inputReps && (
                      <Button
                        onClick={handleCompleteSet}
                        className="w-full"
                        variant="outline"
                      >
                        <Icon name="Check" size={20} className="mr-2" />
                        Завершить подход
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentScreen === 'creator' && (
        <div className="p-4 space-y-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gradient">Конструктор</h1>
            <p className="text-muted-foreground text-sm">Создай свою тренировку</p>
          </div>

          <Card className="p-4 space-y-4">
            <div>
              <Label>Название тренировки</Label>
              <Input placeholder="Грудь + Трицепс" />
            </div>

            <div>
              <Label>Описание</Label>
              <Textarea placeholder="Тяжелая тренировка на верх тела..." rows={3} />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Упражнения</h3>
                <Button size="sm" className="gradient-energy">
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить
                </Button>
              </div>

              <div className="space-y-3">
                <Card className="p-3 bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <Input placeholder="Название упражнения" className="flex-1 mr-2" />
                    <Button size="icon" variant="ghost">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Подходы</Label>
                      <Input type="number" placeholder="4" />
                    </div>
                    <div>
                      <Label className="text-xs">Вес (кг)</Label>
                      <Input type="number" placeholder="80" />
                    </div>
                    <div>
                      <Label className="text-xs">Отдых (мин)</Label>
                      <Input type="number" placeholder="3" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Button className="w-full gradient-energy">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить тренировку
            </Button>
          </Card>
        </div>
      )}

      {currentScreen === 'stats' && (
        <div className="p-4 space-y-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gradient">Прогресс</h1>
            <p className="text-muted-foreground text-sm">Твой путь к силе</p>
          </div>

          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weight">Вес</TabsTrigger>
              <TabsTrigger value="exercises">Упражнения</TabsTrigger>
              <TabsTrigger value="records">Рекорды</TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Динамика веса (месяц)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weightProgressData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(17 88% 55%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(17 88% 55%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 25%)" />
                    <XAxis dataKey="date" stroke="hsl(0 0% 70%)" />
                    <YAxis stroke="hsl(0 0% 70%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(220 15% 15%)',
                        border: '1px solid hsl(220 15% 25%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="hsl(17 88% 55%)" fillOpacity={1} fill="url(#colorWeight)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="text-center">
                    <Icon name="TrendingUp" size={32} className="text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">+5 кг</div>
                    <div className="text-sm text-muted-foreground">За месяц</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Icon name="Target" size={32} className="text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold">85 кг</div>
                    <div className="text-sm text-muted-foreground">Текущий</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Рабочие веса</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={exerciseProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 25%)" />
                    <XAxis dataKey="name" stroke="hsl(0 0% 70%)" />
                    <YAxis stroke="hsl(0 0% 70%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(220 15% 15%)',
                        border: '1px solid hsl(220 15% 25%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="weight" fill="hsl(199 89% 48%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-3">
              {recordsData.map((record, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{record.exercise}</h3>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gradient">
                        {record.weight} кг
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {record.reps} повторов
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around p-3">
          <Button
            variant={currentScreen === 'workouts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen('workouts')}
            className={currentScreen === 'workouts' ? 'gradient-energy' : ''}
          >
            <Icon name="Dumbbell" size={20} />
          </Button>
          <Button
            variant={currentScreen === 'creator' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen('creator')}
            className={currentScreen === 'creator' ? 'gradient-energy' : ''}
          >
            <Icon name="Plus" size={20} />
          </Button>
          <Button
            variant={currentScreen === 'stats' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen('stats')}
            className={currentScreen === 'stats' ? 'gradient-energy' : ''}
          >
            <Icon name="TrendingUp" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
