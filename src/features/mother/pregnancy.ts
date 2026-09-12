type PregnancyLike = {
  pregnancyStatus: "PLANNING" | "PREGNANT" | "DELIVERED" | "ENDED";
  createdAt: Date;
};

export function selectRelevantPregnancy<T extends PregnancyLike>(pregnancies: T[]) {
  const newestFirst = [...pregnancies].sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
  );
  return (
    newestFirst.find((pregnancy) => pregnancy.pregnancyStatus === "PREGNANT") ??
    newestFirst.find((pregnancy) => pregnancy.pregnancyStatus === "PLANNING") ??
    newestFirst[0] ??
    null
  );
}
