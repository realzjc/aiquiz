import data from "@/data/data.json"
import { DataTable } from "@/components/common/data-table"
import { ChartAreaInteractive } from "@/components/common/chart-area-interactive"
import { useHeader } from "@/contexts/HeaderContext"
import { useEffect } from "react"

export default function Home({ children }: { children?: React.ReactNode }) {
    const { setTitle } = useHeader();

    useEffect(() => {
        setTitle('Home');
    }, [setTitle]);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {/* <SectionCards /> */}
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                </div>
            </div>
        </div>
    )
}
