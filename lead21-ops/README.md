# LEAD21 Ops — fellow koordinatör paneli

Erşen İkibudak için **yıl boyu 21 fellow** takibi:

- CRM + **durum girdisi** (ne yaptı / ne zaman / kanıt)
- **Yıllık plan** matrisi (kim yaptı / kim eksik)
- **Fellow rapor** + CSV
- Puan motoru (Excel ana kart + bonus, %80)
- **Mail** (şablon + Resend; secret yoksa örnek log)
- Görev tracker, takvim

Oyun / jüri / final seçme UI **yok**.

```bash
npm install
npm run dev
```

Seed: 10. dönem fellow isimleri xlsx’ten. Mail için `RESEND_API_KEY` + `MAIL_FROM` (Cursor secrets).
