import { BackIcon } from "@/components/Icon";
import { ServerDetailLoading } from "@/components/loading/ServerDetailLoading";
import ServerFlag from "@/components/ServerFlag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWebSocketContext } from "@/hooks/use-websocket-context";
import { cn, formatNezhaInfo } from "@/lib/utils";
import { NezhaWebsocketResponse } from "@/types/nezha-api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatBytes } from "@/lib/format";

export default function ServerDetailOverview({
  server_id,
}: {
  server_id: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { lastMessage, readyState } = useWebSocketContext();

  if (readyState !== 1) {
    return <ServerDetailLoading />;
  }

  const nezhaWsData = lastMessage
    ? (JSON.parse(lastMessage.data) as NezhaWebsocketResponse)
    : null;

  if (!nezhaWsData) {
    return <ServerDetailLoading />;
  }

  const server = nezhaWsData.servers.find((s) => s.id === Number(server_id));

  if (!server) {
    return <ServerDetailLoading />;
  }

  const { name, online, uptime, version } = formatNezhaInfo(
    nezhaWsData.now,
    server,
  );

  return (
    <div>
      <div
        onClick={() => navigate("/")}
        className="flex flex-none cursor-pointer font-semibold leading-none items-center break-all tracking-tight gap-0.5 text-xl"
      >
        <BackIcon />
        {name}
      </div>
      <section className="flex flex-wrap gap-2 mt-3">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.status")}
              </p>
              <Badge
                className={cn(
                  "text-[9px] rounded-[6px] w-fit px-1 py-0 -mt-[0.3px] dark:text-white",
                  {
                    " bg-green-800": online,
                    " bg-red-600": !online,
                  },
                )}
              >
                {online ? t("serverDetail.online") : t("serverDetail.offline")}
              </Badge>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.uptime")}
              </p>
              <div className="text-xs">
                {" "}
                {online ? (uptime / 86400).toFixed(0) : "N/A"} {"Days"}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.version")}
              </p>
              <div className="text-xs">
                {version || t("serverDetail.unknown")}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.arch")}
              </p>
              <div className="text-xs">
                {server.host.arch || t("serverDetail.unknown")}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.mem")}
              </p>
              <div className="text-xs">
                {formatBytes(server.host.mem_total)}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.disk")}
              </p>
              <div className="text-xs">
                {formatBytes(server.host.disk_total)}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.region")}
              </p>
              <section className="flex items-start gap-1">
                <div className="text-xs text-start">
                  {server.country_code?.toUpperCase() ||
                    t("serverDetail.unknown")}
                </div>
                {server.country_code && (
                  <ServerFlag
                    className="text-[11px] -mt-[1px]"
                    country_code={server.country_code}
                  />
                )}
              </section>
            </section>
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.system")}
              </p>
              {server.host.platform ? (
                <div className="text-xs">
                  {" "}
                  {server.host.platform || t("serverDetail.unknown")} -{" "}
                  {server.host.platform_version}{" "}
                </div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"CPU"}</p>
              {server.host.cpu ? (
                <div className="text-xs"> {server.host.cpu}</div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"Load"}</p>
              {server.state.load_1 ? (
                <div className="text-xs">
                  {server.state.load_1} / {server.state.load_5} /{" "}
                  {server.state.load_15}
                </div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.upload")}
              </p>
              {server.state.net_out_transfer ? (
                <div className="text-xs">
                  {" "}
                  {formatBytes(server.state.net_out_transfer)}{" "}
                </div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("serverDetail.download")}
              </p>
              {server.state.net_in_transfer ? (
                <div className="text-xs">
                  {" "}
                  {formatBytes(server.state.net_in_transfer)}{" "}
                </div>
              ) : (
                <div className="text-xs"> {t("serverDetail.unknown")}</div>
              )}
            </section>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
