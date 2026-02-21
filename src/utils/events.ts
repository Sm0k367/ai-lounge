// Timed events, rare FX, scheduled drops - FREE using browser timers

export interface ClubEvent {
  id: string;
  type: 'laser-show' | 'confetti' | 'strobe' | 'smoke' | 'spotlight' | 'bass-drop' | 'crowd-wave';
  duration: number;
  intensity: number;
  timestamp: number;
}

export class EventEngine {
  private events: ClubEvent[] = [];
  private eventCallbacks: Map<string, (event: ClubEvent) => void> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private lastEventTime: number = 0;
  private minTimeBetweenEvents: number = 15000; // 15 seconds minimum
  
  start() {
    // Random events every 20-60 seconds
    this.intervalId = setInterval(() => {
      const now = Date.now();
      if (now - this.lastEventTime > this.minTimeBetweenEvents) {
        this.triggerRandomEvent();
        this.lastEventTime = now;
      }
    }, 20000 + Math.random() * 40000);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private triggerRandomEvent() {
    const eventTypes: ClubEvent['type'][] = [
      'laser-show',
      'confetti',
      'strobe',
      'smoke',
      'spotlight',
      'bass-drop',
      'crowd-wave'
    ];
    
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const event: ClubEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      type,
      duration: this.getEventDuration(type),
      intensity: 0.5 + Math.random() * 0.5,
      timestamp: Date.now()
    };
    
    this.events.push(event);
    this.notifyEvent(event);
    
    // Clean up old events
    setTimeout(() => {
      this.events = this.events.filter(e => e.id !== event.id);
    }, event.duration);
  }
  
  private getEventDuration(type: ClubEvent['type']): number {
    switch (type) {
      case 'laser-show': return 8000;
      case 'confetti': return 5000;
      case 'strobe': return 3000;
      case 'smoke': return 10000;
      case 'spotlight': return 6000;
      case 'bass-drop': return 2000;
      case 'crowd-wave': return 4000;
      default: return 5000;
    }
  }
  
  triggerEvent(type: ClubEvent['type'], intensity: number = 1) {
    const event: ClubEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      type,
      duration: this.getEventDuration(type),
      intensity,
      timestamp: Date.now()
    };
    
    this.events.push(event);
    this.notifyEvent(event);
    
    setTimeout(() => {
      this.events = this.events.filter(e => e.id !== event.id);
    }, event.duration);
  }
  
  private notifyEvent(event: ClubEvent) {
    this.eventCallbacks.forEach((callback) => {
      callback(event);
    });
  }
  
  onEvent(id: string, callback: (event: ClubEvent) => void) {
    this.eventCallbacks.set(id, callback);
  }
  
  offEvent(id: string) {
    this.eventCallbacks.delete(id);
  }
  
  getActiveEvents(): ClubEvent[] {
    return this.events;
  }
}

// Special time-based events (e.g., every hour on the hour)
export class ScheduledEvents {
  private scheduledCallbacks: Map<string, () => void> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  
  start() {
    this.checkInterval = setInterval(() => {
      this.checkScheduledEvents();
    }, 60000); // Check every minute
  }
  
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  private checkScheduledEvents() {
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    
    // Every hour on the hour
    if (minutes === 0) {
      this.notifyScheduled('hourly');
    }
    
    // Special events at specific times
    if (hours === 0 && minutes === 0) {
      this.notifyScheduled('midnight');
    }
    
    if (hours === 12 && minutes === 0) {
      this.notifyScheduled('noon');
    }
    
    // Weekend party mode
    const day = now.getDay();
    if ((day === 5 || day === 6) && hours >= 20) {
      this.notifyScheduled('weekend-party');
    }
  }
  
  private notifyScheduled(eventType: string) {
    this.scheduledCallbacks.forEach((callback, id) => {
      if (id.includes(eventType)) {
        callback();
      }
    });
  }
  
  onScheduled(id: string, callback: () => void) {
    this.scheduledCallbacks.set(id, callback);
  }
  
  offScheduled(id: string) {
    this.scheduledCallbacks.delete(id);
  }
}

// Achievement system (stored in localStorage - FREE!)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export class AchievementEngine {
  private static STORAGE_KEY = 'ai-lounge-achievements';
  private achievements: Map<string, Achievement> = new Map();
  private onUnlockCallbacks: ((achievement: Achievement) => void)[] = [];
  
  constructor() {
    this.initializeAchievements();
    this.loadProgress();
  }
  
  private initializeAchievements() {
    const achievementList: Achievement[] = [
      {
        id: 'first-visit',
        name: 'First Timer',
        description: 'Welcome to the AI Lounge!',
        icon: '🎉',
        unlocked: false
      },
      {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Visit after midnight',
        icon: '🦉',
        unlocked: false
      },
      {
        id: 'social-butterfly',
        name: 'Social Butterfly',
        description: 'Chat with 10 different people',
        icon: '🦋',
        unlocked: false
      },
      {
        id: 'dance-master',
        name: 'Dance Master',
        description: 'Spend 30 minutes in the lounge',
        icon: '💃',
        unlocked: false
      },
      {
        id: 'vip',
        name: 'VIP Member',
        description: 'Visit 10 times',
        icon: '⭐',
        unlocked: false
      }
    ];
    
    achievementList.forEach(a => this.achievements.set(a.id, a));
  }
  
  private loadProgress() {
    const saved = localStorage.getItem(AchievementEngine.STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved);
      Object.keys(progress).forEach(id => {
        const achievement = this.achievements.get(id);
        if (achievement && progress[id].unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = progress[id].unlockedAt;
        }
      });
    }
  }
  
  private saveProgress() {
    const progress: Record<string, any> = {};
    this.achievements.forEach((achievement, id) => {
      progress[id] = {
        unlocked: achievement.unlocked,
        unlockedAt: achievement.unlockedAt
      };
    });
    localStorage.setItem(AchievementEngine.STORAGE_KEY, JSON.stringify(progress));
  }
  
  unlock(achievementId: string) {
    const achievement = this.achievements.get(achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      this.saveProgress();
      this.onUnlockCallbacks.forEach(cb => cb(achievement));
    }
  }
  
  checkAchievement(id: string, condition: boolean) {
    if (condition) {
      this.unlock(id);
    }
  }
  
  getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }
  
  getUnlockedCount(): number {
    return Array.from(this.achievements.values()).filter(a => a.unlocked).length;
  }
  
  onUnlock(callback: (achievement: Achievement) => void) {
    this.onUnlockCallbacks.push(callback);
  }
}
