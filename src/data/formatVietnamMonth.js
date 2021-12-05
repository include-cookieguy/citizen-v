import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";
import formatDistance from "date-fns/locale/ru/_lib/formatDistance";
import formatRelative from "date-fns/locale/ru/_lib/formatRelative";
import localize from "date-fns/locale/ru/_lib/localize";
import match from "date-fns/locale/ru/_lib/match";
import formatLong from "date-fns/locale/ru/_lib/formatLong";

const monthValues = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  abbreviated: [
    "Thg Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Thg Mười Một",
    "Thg Mười Hai",
  ],
  wide: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
};

const dayValues = {
  narrow: ["2", "3", "4", "5", "6", "7", "CN"],
  abbreviated: [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ],
  wide: ["2", "3", "4", "5", "6", "7", "C"],
};

const vnLocale = {
  formatDistance,
  formatLong,
  formatRelative,
  localize: {
    ...localize,
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide",
      defaultFormattingWidth: "wide",
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide",
      defaultFormattingWidth: "wide",
    }),
  },
  match,
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 1,
  },
};

export default vnLocale;
