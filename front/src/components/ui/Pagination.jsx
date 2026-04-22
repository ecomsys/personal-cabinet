import { Button, Icon } from "@/components/ui";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onChange,
  className = "",
}) {
  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <div
      className={`flex items-center justify-end gap-2 mt-4 px-4 ${className}`}
    >
      {/* FIRST */}
      <Button
        size="icon"
        variant="secondary"
        disabled={isFirst}
        onClick={() => onChange(1)}
      >
        <Icon name="left-double" className="w-5 h-5"></Icon>
      </Button>

      {/* PREV */}
      <Button
        size="icon"
        variant="secondary"
        disabled={isFirst}
        onClick={() => onChange(page - 1)}
      >
        <Icon name="left-once" className="w-5 h-5"></Icon>
      </Button>

      {/* INFO */}
      <span className="text-sm text-gray-500 px-2">
        Page {page} of {totalPages}
      </span>

      {/* NEXT */}
      <Button
        size="icon"
        variant="secondary"
        disabled={isLast}
        onClick={() => onChange(page + 1)}
      >
        <Icon name="right-once" className="w-5 h-5"></Icon>
      </Button>

      {/* LAST */}
      <Button
        size="icon"
        variant="secondary"
        disabled={isLast}
        onClick={() => onChange(totalPages)}
      >
        <Icon name="right-double" className="w-5 h-5"></Icon>
      </Button>
    </div>
  );
}

/*========================================================
HOW USE IT ?
========================================================*/

// const [page, setPage] = useState(1);
// const [meta, setMeta] = useState(null);
//   const [loading, setLoading] = useState(true);

// const fetchSessions = async (page) => {
//   try {
//     setLoading(true);

//     const res = await getAllSessionsAdmin({
//       page,
//       limit: 10,
//     });

//     setSessions(res.data);
//     setMeta(res.meta);

//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchSessions(page);
// }, [page]);
