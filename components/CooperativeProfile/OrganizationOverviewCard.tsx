"use client";
import React from "react";

type Org = any;

export default function OrganizationOverviewCard({ org }: { org: Org }) {
  const name = org?.name || "—";
  const email = org?.email || "—";
  const address = org?.address || "—";
  const logo = org?.logo || null;
  const verified = !!org?.verified;
  const memberCount = org?.memberCount ?? org?.memberStats?.total ?? 0;
  const lastUpdated = org?.balances?.lastUpdated || null;

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={`${name} logo`} className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-semibold">
              {name
                ?.split(" ")
                .map((s: string) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2 justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg md:text-xl font-semibold leading-tight">{name}</h3>
              <span
                className={`inline-flex items-center gap-2 text-sm px-2 py-1 rounded-full ${
                  verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
                }`}
                title={verified ? "Verified" : "Not verified"}
              >
                {verified ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 9v4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
                <span className="text-xs">{verified ? "Verified" : "Not verified"}</span>
              </span>
            </div>

            <div className="mt-2 md:mt-0 text-sm text-muted-foreground md:text-right">
              <div>{email}</div>
              <div className="truncate w-full">{address}</div>
              {lastUpdated && (
                <div className="mt-1 text-xs text-gray-500">Updated {new Date(lastUpdated).toLocaleString()}</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end items-start gap-3 w-full md:w-auto">
          <div className="text-sm text-gray-500">Members</div>
          <div className="text-lg font-semibold">{memberCount}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded text-sm text-primary">Edit</button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Invite</button>
          </div>
        </div>
      </div>
    </div>
  );
}
