/**
 * Vitest setup file — registreert Angular locale data voor alle tests.
 *
 * formatDate / formatNumber / formatCurrency vereisen dat de locale-data
 * is geregistreerd via registerLocaleData() voordat Angular-pipes ze kunnen gebruiken.
 * In de browser doet app.config.ts dit; in jsdom/Vitest moet dit expliciet hier.
 */
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import localeEnGb from '@angular/common/locales/en-GB';

registerLocaleData(localeNl, 'nl-NL');
registerLocaleData(localeEnGb, 'en-GB');
