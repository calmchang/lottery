svn delete svn://192.168.1.40/MSI-FE/h5/maizi/lottery0207 -m "delete auto sh"
svn mkdir svn://192.168.1.40/MSI-FE/h5/maizi/lottery0207 -m "create auto sh"
svn import ./dist/ svn://192.168.1.40/MSI-FE/h5/maizi/lottery0207/ -m "upload auto sh"