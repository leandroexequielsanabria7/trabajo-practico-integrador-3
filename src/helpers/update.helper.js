export const toDotNotation = (data, embeddedKey) => {
  const { [embeddedKey]: embedded, ...rest } = data;
  const changes = { ...rest };

  if (embedded) {
    for (const [field, value] of Object.entries(embedded)) {
      changes[`${embeddedKey}.${field}`] = value;
    }
  }

  return changes;
};