export default {
  data() {
    return {
      planificationInfo: {
        gardens: {
          label: 'Jardin',
          img: '/icons/garden.svg',
        },
        greenhouse: {
          label: "Serre",
          img: '/icons/greenhouse.svg',
        }
      },
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