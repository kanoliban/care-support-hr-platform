import { Client, Caregiver, MatchingCriteria, ComplianceStatus } from '../types';

export class SchedulingService {
  /**
   * Find matching caregivers for a client based on criteria
   */
  static findMatchingCaregivers(
    client: Client,
    caregivers: Caregiver[],
    criteria: MatchingCriteria
  ): { caregiver: Caregiver; score: number; complianceStatus: ComplianceStatus }[] {
    return caregivers
      .map(caregiver => {
        const score = this.calculateMatchScore(caregiver, criteria);
        const complianceStatus = this.checkCompliance(client, caregiver);
        
        return {
          caregiver,
          score,
          complianceStatus
        };
      })
      .filter(match => match.score > 0 && match.complianceStatus.isCompliant)
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate match score between caregiver and criteria
   */
  private static calculateMatchScore(caregiver: Caregiver, criteria: MatchingCriteria): number {
    let score = 0;
    const maxScore = 100;

    // Check credentials (40 points)
    const credentialScore = this.calculateCredentialScore(
      caregiver.credentials,
      criteria.requiredCredentials
    );
    score += credentialScore * 0.4;

    // Check preferred caregivers (20 points)
    if (criteria.preferredCaregivers?.includes(caregiver.id)) {
      score += 20;
    }

    // Check location if applicable (20 points)
    if (criteria.locationConstraints && caregiver.location) {
      const distance = this.calculateDistance(
        criteria.locationConstraints,
        caregiver.location
      );
      const locationScore = Math.max(0, 20 * (1 - distance / criteria.locationConstraints.maxDistance));
      score += locationScore;
    }

    // Check availability (20 points)
    const availabilityScore = this.calculateAvailabilityScore(
      caregiver.availability,
      criteria.shiftTiming
    );
    score += availabilityScore * 0.2;

    return Math.min(score, maxScore);
  }

  /**
   * Check compliance between client and caregiver
   */
  private static checkCompliance(client: Client, caregiver: Caregiver): ComplianceStatus {
    const checks = [];
    let isCompliant = true;

    // Check required credentials
    for (const required of client.requiredCredentials) {
      const credential = caregiver.credentials.find(c => c.type === required);
      
      if (!credential) {
        checks.push({
          control: 'CRD-1',
          status: 'Fail',
          message: `Missing required credential: ${required}`
        });
        isCompliant = false;
        continue;
      }

      if (credential.status === 'Expired') {
        checks.push({
          control: 'CRD-1',
          status: 'Fail',
          message: `${required} is expired`
        });
        isCompliant = false;
      } else if (credential.status === 'Expiring Soon') {
        checks.push({
          control: 'CRD-1',
          status: 'Warning',
          message: `${required} expires soon`
        });
      } else {
        checks.push({
          control: 'CRD-1',
          status: 'Pass',
          message: `${required} is valid`
        });
      }
    }

    // Check caregiver status
    if (caregiver.status !== 'Active') {
      checks.push({
        control: 'CRD-2',
        status: 'Fail',
        message: `Caregiver is ${caregiver.status.toLowerCase()}`
      });
      isCompliant = false;
    } else {
      checks.push({
        control: 'CRD-2',
        status: 'Pass',
        message: 'Caregiver status is active'
      });
    }

    // Check location compliance if required
    if (client.locationConstraints && caregiver.location) {
      const distance = this.calculateDistance(
        client.locationConstraints,
        caregiver.location
      );
      
      if (distance > client.locationConstraints.maxDistance) {
        checks.push({
          control: 'EVV-2',
          status: 'Fail',
          message: `Caregiver outside service area (${Math.round(distance)}km)`
        });
        isCompliant = false;
      } else {
        checks.push({
          control: 'EVV-2',
          status: 'Pass',
          message: 'Caregiver within service area'
        });
      }
    }

    return {
      isCompliant,
      checks
    };
  }

  /**
   * Calculate credential match score
   */
  private static calculateCredentialScore(
    caregiverCredentials: Caregiver['credentials'],
    requiredCredentials: string[]
  ): number {
    if (requiredCredentials.length === 0) return 100;

    const validCredentials = caregiverCredentials.filter(
      c => c.status === 'Valid' && requiredCredentials.includes(c.type)
    );

    return (validCredentials.length / requiredCredentials.length) * 100;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private static calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);
    const lat1 = this.toRad(point1.latitude);
    const lat2 = this.toRad(point2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRad(value: number): number {
    return value * Math.PI / 180;
  }

  /**
   * Calculate availability score
   */
  private static calculateAvailabilityScore(
    availability: Caregiver['availability'] | undefined,
    shiftTiming: { start: string; end: string }
  ): number {
    if (!availability) return 0;

    const shiftStart = new Date(shiftTiming.start);
    const shiftEnd = new Date(shiftTiming.end);
    
    // Check if shift is within preferred hours
    if (availability.preferredHours) {
      const isPreferredTime = availability.preferredHours.some(hours => {
        const prefStart = new Date(`1970-01-01T${hours.start}`);
        const prefEnd = new Date(`1970-01-01T${hours.end}`);
        const shiftStartTime = new Date(`1970-01-01T${shiftStart.getHours()}:${shiftStart.getMinutes()}`);
        return shiftStartTime >= prefStart && shiftStartTime <= prefEnd;
      });
      if (!isPreferredTime) return 50;
    }

    // Check weekly hours limit
    if (availability.weeklyHours) {
      // In a real app, we would check current weekly hours
      // For now, assume all shifts are within limits
    }

    // Check blocked dates
    if (availability.blockedDates) {
      const isBlocked = availability.blockedDates.some(date => {
        const blockedDate = new Date(date);
        return blockedDate.toDateString() === shiftStart.toDateString();
      });
      if (isBlocked) return 0;
    }

    return 100;
  }
}