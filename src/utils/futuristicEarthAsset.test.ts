import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_WINDOW_MENU_OPTIONS,
  filterWindowMenuOptions,
  FUTURISTIC_EARTH_HEADER_DATA_URI,
  HUMAN_ROBOT_HAND_TOUCH_DATA_URI,
} from './futuristicEarthAsset.ts';

test('ALL_WINDOW_MENU_OPTIONS contains all 15 application windows including home', () => {
  assert.equal(ALL_WINDOW_MENU_OPTIONS.length, 15);
  const ids = ALL_WINDOW_MENU_OPTIONS.map(o => o.id);
  assert.ok(ids.includes('home'));
  assert.ok(ids.includes('library'));
  assert.ok(ids.includes('dashboard'));
  assert.ok(ids.includes('quant-trading'));
  assert.ok(ids.includes('games'));
  assert.ok(ids.includes('analytics'));
  assert.ok(ids.includes('non-technical'));
  assert.ok(ids.includes('news'));
  assert.ok(ids.includes('contests'));
  assert.ok(ids.includes('forum'));
  assert.ok(ids.includes('scan-transfer'));
  assert.ok(ids.includes('summarizer'));
  assert.ok(ids.includes('collaborative-doc'));
  assert.ok(ids.includes('profile'));
  assert.ok(ids.includes('settings'));
});

test('filterWindowMenuOptions filters windows by title, subtitle, or group', () => {
  const all = filterWindowMenuOptions('');
  assert.equal(all.length, 15);

  const quant = filterWindowMenuOptions('quant');
  assert.ok(quant.some(o => o.id === 'quant-trading'));

  const themeMatches = filterWindowMenuOptions('theme');
  assert.ok(themeMatches.some(o => o.id === 'profile'));
  assert.ok(themeMatches.some(o => o.id === 'settings'));
});

test('FUTURISTIC_EARTH_HEADER_DATA_URI is a valid encoded SVG data URI for img src', () => {
  assert.ok(FUTURISTIC_EARTH_HEADER_DATA_URI.startsWith('data:image/svg+xml;utf8,'));
  assert.ok(FUTURISTIC_EARTH_HEADER_DATA_URI.length > 1000);
});

test('HUMAN_ROBOT_HAND_TOUCH_DATA_URI is a valid encoded SVG data URI of human hand touching robot hand', () => {
  assert.ok(HUMAN_ROBOT_HAND_TOUCH_DATA_URI.startsWith('data:image/svg+xml;utf8,'));
  assert.ok(HUMAN_ROBOT_HAND_TOUCH_DATA_URI.length > 1500);
  const decoded = decodeURIComponent(HUMAN_ROBOT_HAND_TOUCH_DATA_URI);
  assert.ok(decoded.includes('human-hand-assembly'));
  assert.ok(decoded.includes('robot-hand-assembly'));
  assert.ok(decoded.includes('symbiosis-contact-spark'));
});

