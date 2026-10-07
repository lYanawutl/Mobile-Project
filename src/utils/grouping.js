export function groupByCategory(items) {
  const sections = [];
  for (const item of items) {
    const last = sections[sections.length - 1];
    if (last && last.categoryId === item.category_id) {
      last.data.push(item);
    } else {
      sections.push({
        categoryId: item.category_id,
        title: item.category_name,
        data: [item],
      });
    }
  }
  return sections;
}

export function groupByRound(lines) {
  const sections = [];
  for (const line of lines) {
    const last = sections[sections.length - 1];
    if (last && last.roundNo === line.round_no) {
      last.data.push(line);
    } else {
      sections.push({
        roundNo: line.round_no,
        orderedAt: line.ordered_at,
        data: [line],
      });
    }
  }
  return sections;
}
