import { useState, useEffect } from "react";

export default function useOwners(ownerIds = [], token) {
  const [owners, setOwners] = useState({});

  useEffect(() => {
    if (!ownerIds || ownerIds.length === 0) return;

    const ids = Array.from(
      new Set(ownerIds.filter((id) => typeof id === "string" && id.trim()))
    );
    if (ids.length === 0) return;

    let cancelled = false;

    async function fetchAll() {
      const map = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:8000/users/${id}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) {
              map[id] = id;
              return;
            }
            const data = await res.json();
            const user = Array.isArray(data) ? data[0] : data;
            map[id] = user?.name || id;
          } catch (err) {
            map[id] = id;
          }
        })
      );
      if (!cancelled) setOwners((prev) => ({ ...prev, ...map }));
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(ownerIds || []), token]);

  return owners;
}
