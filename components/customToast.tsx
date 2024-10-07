
import { Toaster } from 'sonner';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const CustomToast = () => {
    return (
        <Toaster
            richColors
            icons={{
                success: <CheckCircleOutlinedIcon />,
                info: < InfoOutlinedIcon />,
                warning: <WarningAmberOutlinedIcon />,
                error: <ErrorOutlineOutlinedIcon />,
                loading: <CachedOutlinedIcon />,
            }}
        />
    )
}

export default CustomToast