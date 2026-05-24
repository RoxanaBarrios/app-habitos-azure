import { getTodayDate, isToday, isYesterday } from '../storage/habitService';

describe('Utility Functions - habitService', () => {
  describe('getTodayDate', () => {
    it('debería retornar la fecha de hoy en formato YYYY-MM-DD', () => {
      const result = getTodayDate();
      const expected = new Date().toISOString().split('T')[0];
      expect(result).toBe(expected);
    });
  });

  describe('isToday', () => {
    it('debería retornar true si la fecha es hoy', () => {
      const today = getTodayDate();
      expect(isToday(today)).toBe(true);
    });

    it('debería retornar false si la fecha no es hoy', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      expect(isToday(yesterdayStr)).toBe(false);
    });

    it('debería retornar false si la fecha es null', () => {
      expect(isToday(null)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('debería retornar true si la fecha es ayer', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      expect(isYesterday(yesterdayStr)).toBe(true);
    });

    it('debería retornar false si la fecha es hoy', () => {
      const today = getTodayDate();
      expect(isYesterday(today)).toBe(false);
    });

    it('debería retornar false si la fecha es null', () => {
      expect(isYesterday(null)).toBe(false);
    });
  });
});
