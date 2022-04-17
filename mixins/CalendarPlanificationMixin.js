export default {
  data() {
    return {
      months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
      numbers: 4,
      weeks: 4,
    }
  },
  methods: {
    isLastWeek(week) {
      return (
        week === 4
      );
    },
    isLastMonth(indexMonth) {
      return (
        indexMonth === this.months.length - 1
      );
    },
  },
}