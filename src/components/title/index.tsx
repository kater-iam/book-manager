import { Box, Typography } from "@mui/material"
import { config } from "@/config"

export const Title: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
    return (
        <Box display={"flex"} alignItems={"center"} gap={1}>
            <img src={config.logo} alt={config.title} width={30} height={30} />
            {!collapsed ? <Typography fontSize={14} fontWeight={700}>{config.title}</Typography> : null}
        </Box>
    )
}

